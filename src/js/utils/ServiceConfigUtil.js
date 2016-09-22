import HostUtil from '../utils/HostUtil';
import Networking from '../constants/Networking';

const serviceAddressKey = 'Service Address';

function buildHostName(id, port) {
  let hostname = HostUtil.stringToHostname(id);
  return `${hostname}${Networking.L4LB_ADDRESS}:${port}`;
}

function defaultCreateLink(contents) {
  return contents;
}

function hasVIPLabel(portDefinition) {
  return portDefinition.labels &&
    Object.keys(portDefinition.labels).find(function (key) {
      return /^VIP_[0-9]+$/.test(key);
    });
}

var ServiceConfigUtil = {
  getCommandString(container) {
    // Pre-pods approach
    if (container.cmd) {
      return container.cmd;
    }

    // Pods approach
    // https://github.com/mesosphere/marathon/blob/feature/pods/docs/docs/rest-api/public/api/v2/types/podContainer.raml#L61
    let {shell, argv} =
      Util.findNestedPropertyInObject(container, 'exec.command') || {};

    if (shell) {
      return shell;
    }
    if (Array.isArray(argv)) {
      return argv.join(' ');
    }

    return null;
  },

  getPortDefinitionGroups(id, portDefinitions, createLink = defaultCreateLink) {
    return portDefinitions.map(function (portDefinition, index) {
      let hash = Object.assign({}, portDefinition);
      let headline = `Port Definition ${index + 1}`;

      if (portDefinition.name) {
        headline += ` (${portDefinition.name})`;
      }

      // Check if this port is load balanced
      if (hasVIPLabel(portDefinition)) {
        let link = buildHostName(id, portDefinition.port);
        hash[serviceAddressKey] = createLink(link, link);
      }

      return {
        hash,
        headline
      };
    });
  }

};

module.exports = ServiceConfigUtil;
