#!/bin/bash

REGISTRY="https://npmjs-registry.ivyteam.ch/"

npm unpublish "@axonivy/webservice-editor@${1}" --registry $REGISTRY
npm unpublish "@axonivy/webservice-editor-protocol@${1}" --registry $REGISTRY