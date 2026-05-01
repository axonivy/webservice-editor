#!/bin/bash

REGISTRY="https://npmjs-registry.ivyteam.ch/"

pnpm unpublish "@axonivy/webservice-editor@${1}" --registry $REGISTRY
pnpm unpublish "@axonivy/webservice-editor-protocol@${1}" --registry $REGISTRY