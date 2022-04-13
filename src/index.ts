import {
  AppConfigDataClient,
  BadRequestException,
  GetLatestConfigurationCommand,
  StartConfigurationSessionCommand,
} from "@aws-sdk/client-appconfigdata";

const client = new AppConfigDataClient({});
let existingToken: string;

const getToken = async (): Promise<string> => {
  const getSession = new StartConfigurationSessionCommand({
    ApplicationIdentifier: process.env.APP_CONFIG_APP_IDENTIFIER,
    ConfigurationProfileIdentifier:
      process.env.APP_CONFIG_CONFIG_PROFILE_IDENTIFIER,
    EnvironmentIdentifier: process.env.APP_CONFIG_ENVIRONMENT_IDENTIFIER,
  });
  const sessionToken = await client.send(getSession);
  return sessionToken.InitialConfigurationToken || "";
};

const featureFlag = async (flag: string): Promise<boolean> => {
  if (!existingToken) {
    existingToken = await getToken();
    console.log(existingToken);
  }
  try {
    const command = new GetLatestConfigurationCommand({
      ConfigurationToken: existingToken,
    });
    const response = await client.send(command);
    let flags: any = {};
    if (response.Configuration) {
      let str = "";
      for (let i = 0; i < response.Configuration.length; i++) {
        str += String.fromCharCode(response.Configuration[i]);
      }
      const allFlag = JSON.parse(str);
      console.log(allFlag);
      flags = Object.assign({}, allFlag);
    }
    return Boolean(flags[flag]?.enabled);
  } catch (err) {
    if (err instanceof BadRequestException) {
      existingToken = await getToken();
      console.log(existingToken);
      // recall
      return featureFlag(flag);
    } else {
      throw err;
    }
  }
};

export default featureFlag;
