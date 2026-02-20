package com.axonivy.connectivity.rest.client.connect;

import javax.ws.rs.core.Feature;
import javax.ws.rs.core.FeatureContext;

public class MyFeature implements Feature {

  @Override
  public boolean configure(FeatureContext context) {
    return true;
  }

}
