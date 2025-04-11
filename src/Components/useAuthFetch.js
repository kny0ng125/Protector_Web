import {useCallback} from 'react';
import axios from 'axios';

const useAuthFetch = (accessToken, refreshAccessToken, logout) => {
    return useCallback(
        async(url, options = {}) => {
            if(!options.header) options.headers = {};

            options.headers['Authorization'] = `Bearer ${accessToken}`;

            if(options.method && options.method.toUpperCase() === 'POST') {
                if(options.body) {
                    options.data = JSON.parse(options.body);
                    delete options.body;
                }

                if(!options.headers['Content-Type']) {
                    options.headers['Content-Type'] = 'application/json';
                }
            }

            try{
                let response = await axios(url, options);

                if(response.status === 400 || response.data?.message === '유효하지 않은 토큰입니다.') {
                    const newToken = await refreshAccessToken();
                    if(newToken) {
                        options.headers['Authorization'] = `Bearer ${newToken}`;
                        response = await axios(url, options);
                    } else {
                        logout('세션이 만료되어 로그아웃되었습니다. 다시 로그인해주세요.');
                    }
                }

                return response;    
            }catch (error) {
                console.error('Error in authFetch:', error);
                return error.response;
            }
        },
        [accessToken, refreshAccessToken, logout]
    );
};

export default useAuthFetch;