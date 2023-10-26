import {
  KindeSDK,
  Storage,
  TokenType,
  UserProfile
} from '@kinde-oss/react-native-sdk-0-6x';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import {dependencies} from '../../package.json';
import Avatar from './Avatar';

const Header = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | undefined>(
    undefined
  );

  const [isLoading, setIsLoading] = useState(false);
  const client = useMemo(
    () =>
      new KindeSDK(
        'https://your_kinde_host.kinde.com',
        'your_schema://your_kinde_host.kinde.com/kinde_callback',
        'your_kinde_client_id',
        'your_schema://your_kinde_host.kinde.com/kinde_callback'
      ),
    []
  );

  const loadData = useCallback(async () => {
    setIsLoading(true);

    const dataPrint: any = {
      'React Version': dependencies.react,
      'React Native Version': dependencies['react-native']
    };
    const token = await client.getToken();
    dataPrint['Full Token'] = JSON.stringify(token);

    const accessToken = await Storage.getAccessToken();
    dataPrint['Access Token'] = accessToken;

    const getClaims = await client.getClaims();
    dataPrint['Get Claims'] = JSON.stringify(getClaims);

    const getOrganization = await client.getOrganization();
    dataPrint['Get Organization'] = JSON.stringify(getOrganization);

    const getUserDetails = await client.getUserDetails();
    dataPrint['Get User Details'] = JSON.stringify(getUserDetails);
    setUserProfile({...getUserDetails});

    const getClaimJti = await client.getClaim('jti');
    dataPrint['Get Claim Jti'] = JSON.stringify(getClaimJti);

    const given_name = await client.getClaim('given_name', TokenType.ID_TOKEN);
    dataPrint['Get Claim Given Name'] = JSON.stringify(given_name);

    const enable_dark_theme = await client.getBooleanFlag('enable_dark_theme');
    dataPrint.enable_dark_theme = JSON.stringify(enable_dark_theme);

    const get_test = await client.getIntegerFlag('get_test', 1);
    dataPrint.get_test = JSON.stringify(get_test);

    const theme = await client.getStringFlag('theme');
    dataPrint.theme = JSON.stringify(theme);

    const user_limit = await client.getIntegerFlag('user_limit');
    dataPrint.user_limit = JSON.stringify(user_limit);

    const getUserOrganizations = await client.getUserOrganizations();
    dataPrint['Get User Organizations'] = JSON.stringify(getUserOrganizations);

    console.log(JSON.stringify(dataPrint, undefined, 4));

    // <-- Enable this block code when you're running debug mode to make the output prettier -->
    // const keys = Object.keys(dataPrint);
    // console.table(keys.map(k => ({Target: k, Result: dataPrint[k]})));

    setIsLoading(false);
  }, [client, setIsLoading, setUserProfile]);

  const checkAuthenticate = async () => {
    if (await client.isAuthenticated) {
      loadData();
    }
  };

  useEffect(() => {
    checkAuthenticate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSignIn = async () => {
    const token = await client.login(); // You can also add org_code as parameter, f.e: client.login({org_code: 'org_123'});
    if (token) {
      loadData();
    }
  };

  const handleSignUp = async () => {
    const token = await client.register(); // You can also add org_code as parameter, f.e: client.login({org_code: 'org_123'});
    if (token) {
      loadData();
    }
  };

  const handleLogout = async () => {
    const isLoggedOut = await client.logout(true);
    if (isLoggedOut) {
      setUserProfile(undefined);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <ActivityIndicator size="large" />;
    }

    if (userProfile) {
      return <Avatar userProfile={userProfile} handleLogout={handleLogout} />;
    }

    return (
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          onPress={handleSignIn}
          style={styles.btn}
          disabled={isLoading}
        >
          <Text style={styles.text}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{...styles.btn, backgroundColor: '#000'}}
          onPress={handleSignUp}
          disabled={isLoading}
        >
          <Text style={{...styles.text, color: '#FFF'}}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.header}>
      <View>
        <Text style={{...styles.text, fontSize: 18}}>KindeAuth</Text>
      </View>

      {renderContent()}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 20
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 20,
    backgroundColor: '#FFF'
  },
  text: {
    fontWeight: '600',
    color: '#000',
    fontSize: 16
  },
  btn: {
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5
  }
});
