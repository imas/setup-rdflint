import fetch from 'node-fetch';
import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';
import * as fs from 'fs';
import * as path from 'path';

async function getLatestRdflintVersion(): Promise<string> {
  const response = await fetch(
    'https://jitpack.io/api/builds/com.github.imas/rdflint/latestOk'
  );
  const { version } = await response.json();

  if (typeof version !== 'string') {
    throw new Error('Failed to get the latest rdflint version');
  }
  return version;
}

async function installRdflint(version: string): Promise<string> {
  const downloadUrl = `https://jitpack.io/com/github/imas/rdflint/${version}/rdflint-${version}.jar`;

  const downloadPath = await tc.downloadTool(downloadUrl);
  const cachePath = await tc.cacheFile(
    downloadPath,
    'rdflint.jar',
    'rdflint',
    version
  );

  const executablePath = path.join(cachePath, 'rdflint');
  fs.writeFileSync(
    executablePath,
    `#!/bin/sh\njava -jar ${cachePath}/rdflint.jar $@`
  );
  fs.chmodSync(executablePath, 0o555);

  return cachePath;
}

async function run(): Promise<void> {
  try {
    let version = core.getInput('rdflint-version');
    if (!version || version === 'latest') {
      version = await getLatestRdflintVersion();
    }

    let rdflintPath = tc.find('rdflint', version);
    if (!rdflintPath) {
      console.log('Installing rdflint ' + version);
      rdflintPath = await installRdflint(version);
    }

    core.addPath(rdflintPath);
  } catch (e) {
    core.setFailed(e.message);
  }
}

run();
