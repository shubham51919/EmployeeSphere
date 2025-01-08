import React, { useState, useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import { Providers, ProviderState } from "@microsoft/mgt-element";

const ProtectedRoute = ({ isAllow, component: Component, ...rest }) => {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const updateState = () => {
      const provider = Providers.globalProvider;

      setIsSignedIn(provider && provider.state === ProviderState.SignedIn);
    };

    Providers.onProviderUpdated(updateState);

    updateState();

    return () => {
      Providers.removeProviderUpdatedListener(updateState);
    };
  }, []);

  return (
    <Route
      {...rest}
      render={({ hooks }) =>
        isSignedIn || isAllow ? (
          <Component {...{ hooks }} />
        ) : (
          <Redirect to={{ pathname: "/" }} />
        )
      }
    />
  );
};

export default ProtectedRoute;
