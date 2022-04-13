import {
  AppConfigDataClient,
  GetLatestConfigurationCommand,
  StartConfigurationSessionCommand,
} from "@aws-sdk/client-appconfigdata";

const client = new AppConfigDataClient({});

const featureFlag = async (flag: string): Promise<boolean> => {
  const getSession = new StartConfigurationSessionCommand({
    ApplicationIdentifier: process.env.APP_CONFIG_APP_IDENTIFIER,
    ConfigurationProfileIdentifier: process.env.APP_CONFIG_CONFIG_PROFILE_IDENTIFIER,
    EnvironmentIdentifier: process.env.APP_CONFIG_ENVIRONMENT_IDENTIFIER,
  });
  const sessionToken = await client.send(getSession);
  const command = new GetLatestConfigurationCommand({
    ConfigurationToken: sessionToken.InitialConfigurationToken,
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
};

export default featureFlag;
