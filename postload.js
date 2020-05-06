ig.module('mod-version-checker')
  .requires('dom.ready')
  .defines(async () => {
    const { semver } = window.parent;

    function hasProperty(obj, prop) {
      return Object.prototype.hasOwnProperty.call(obj, prop);
    }

    async function fetchCCModDB() {
      let response = await fetch(
        'https://raw.githubusercontent.com/CCDirectLink/CCModDB/master/npDatabase.json',
      );
      return await response.json();
    }

    let ccmoddb = await fetchCCModDB();

    let mod = [];

    function addModStatus(id, displayName, installedVersion) {
      installedVersion = installedVersion || '0.0.0';
      let status = { id, displayName: displayName || id, installedVersion };

      if (hasProperty(ccmoddb, id)) {
        let { metadata } = ccmoddb[id];
        let availableVersion = metadata.version;
        status.availableVersion = availableVersion;
        let order = semver.compare(availableVersion, installedVersion);
        if (order > 0) {
          status.action = 'update';
        } else if (order < 0) {
          status.action = 'downgrade';
        }
      }

      mod.push(status);
    }

    addModStatus('ccloader', 'CCLoader', versions.ccloader);
    for (let mod of activeMods) {
      addModStatus(mod.name, mod.displayName, mod.version);
    }

    console.table(mod);
  });
