/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-enable no-unused-vars */

const ContainerSettings = {
  title: 'Container Settings',
  description: 'Configure your Docker Container',
  type: 'object',
  properties: {
    basic: {
      type: 'group',
      properties: {
        image: {
          description: 'name of your docker image',
          type: 'string',
          getter: function (service) {
            let container = service.getContainerSettings();
            if (container && container.docker && container.docker.image) {
              return container.docker.image;
            }
            return null;
          }
        },
        network: {
          title: 'Network',
          fieldType: 'select',
          options: [
            'Host',
            'Bridged'
          ],
          getter: function (service) {
            let container = service.getContainerSettings();
            if (container && container.docker && container.docker.network) {
              return container.docker.network.toLowerCase();
            }
            return null;
          }
        }
      }
    },
    flags: {
      type: 'group',
      properties: {
        privileged: {
          title: 'Extend runtime privileges',
          type: 'boolean',
          getter: function (service) {
            let container = service.getContainerSettings();
            if (container && container.docker &&
              container.docker.privileged
            ) {
              return container.docker.privileged;
            }
            return null;
          }
        },
        forcePullImage: {
          title: 'Force pull image on every launch',
          type: 'boolean',
          getter: function (service) {
            let container = service.getContainerSettings();
            if (container && container.docker &&
              container.docker.forcePullImage
            ) {
              return container.docker.forcePullImage;
            }
            return null;
          }
        },
      }
    },

    parameters: {
      title: 'Parameters',
      type: 'array',
      duplicable: true,
      addLabel: 'Add Parameter',
      getter: function (service) {
        let container = service.getContainerSettings();
        if (container && container.docker &&
          container.docker.parameters
        ) {
          let parameters = container.docker.parameters;

          return Object.keys(parameters).map(function (key) {
            return {
              key,
              value: parameters[key]
            };
          });
        }
        return null;
      },
      itemShape: {
        properties: {
          key: {
            title: 'Key',
            type: 'string'
          },
          value: {
            title: 'Value',
            type: 'string'
          }
        }
      }
    }
  },
  required: []
};

module.exports = ContainerSettings;
