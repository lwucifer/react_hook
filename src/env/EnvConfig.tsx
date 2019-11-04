
type EnvKey =  "local" | "development" | "staging" | "production" | undefined;

export const env: EnvKey = (process.env.REACT_APP_ENV) as EnvKey || "local";

interface EnvConfig {
  env: string;
  apiUrl: string;
  contextRoot: string;
}

export function getEnvConfig(): EnvConfig {
  if (env === "production") {
    return {
      env: "production",
      contextRoot: "/mhds",
      apiUrl: "/mhds/api/"
    } as EnvConfig;
  } else if (env === "staging") {
    return {
      env: "staging",
      contextRoot: "/mhds_Tra",
      apiUrl: "/mhds_Tra/api/"
    } as EnvConfig;
  } else if (env === "development") {
    return {
      env: "development",
      contextRoot: "/mhds_Develop",
      apiUrl: "/mhds_Develop/api/"
    } as EnvConfig;
  } else {
    return {
      env: "local",
      contextRoot: "",
      apiUrl: "http://localhost:39480/mhds_Develop/api/"
    } as EnvConfig;
  }
}
