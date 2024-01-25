import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';
import * as fs from 'fs';
import * as path from 'path';

async function getLatestRdflintVersion(): Promise<string> {
  const url = 'https://jitpack.io/api/builds/com.github.imas/rdflint/latestOk';

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `${url} is currently unavailable: ${response.status} ${response.statusText}`,
    );
  }

  const json = await response.json();

  if (typeof json?.version !== 'string') {
    throw new Error(`Could not find the latest version: ${json?.version}`);
  }

  return json.version;
}

async function installRdflint(version: string): Promise<string> {
  const downloadUrl = `https://jitpack.io/com/github/imas/rdflint/${version}/rdflint-${version}.jar`;

  const downloadPath = await tc.downloadTool(downloadUrl);
  const cachePath = await tc.cacheFile(
    downloadPath,
    'rdflint.jar',
    'rdflint',
    version,
  );

  const jarPath = path.join(cachePath, 'rdflint.jar');
  const executablePath = path.join(cachePath, 'rdflint');

  fs.writeFileSync(executablePath, `#!/bin/sh\nexec java -jar ${jarPath} "$@"`);
  fs.chmodSync(executablePath, 0o555);

  return cachePath;
}

async function run(): Promise<void> {
  let version = core.getInput('rdflint-version');
  if (!version || version === 'latest') {
    version = await getLatestRdflintVersion();
  }

  let rdflintPath = tc.find('rdflint', version);
  if (!rdflintPath) {
    core.info('Installing rdflint ' + version);
    rdflintPath = await installRdflint(version);
  }

  core.addPath(rdflintPath);
}

run().catch((e: Error) => {
  core.setFailed(e.message);
});
