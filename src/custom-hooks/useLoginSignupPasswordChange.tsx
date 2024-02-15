import { useCallback } from 'react';

interface loginSignupType {
    signIn: (email: string, password: string) => Promise<{
        status: string,
        authToken: string
    }>,
    forgotPassword: (email: string) => Promise<{
        status: string,
    }>,
    confirmOneTimePassword: (email: string, password: string) => Promise<{
        status: string,
    }>,
    updatePassword: (email: string, newPassword: string, passwordVerificationToken: string) => Promise<{
        status: string,
    }>,
    resetPasswordVerificationToken: (email: string) => Promise<{
        status: string,
    }>
}

const useLoginSignupPasswordChange = (userType: 'field-agent' | 'property-dealer' | 'property-evaluator' | 'city-manager'): loginSignupType => {

    const signIn = useCallback(async (email: string, password: string) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/${userType}/signIn`, {
                method: 'POST',
                body: JSON.stringify({
                    email,
                    password
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if (!response.ok) {
                throw new Error('Some error occured')
            }
            const data = await response.json()
            return data
        } catch (error) {
            throw new Error('error')
        }
    }, [userType])

    const forgotPassword = useCallback(async (email: string) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/${userType}/forgotPassword`, {
                method: 'PATCH',
                body: JSON.stringify({ email }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if (!response.ok) {
                throw new Error('Some error occured')
            }
            const data = await response.json()
            return data
        } catch (error) {
            throw new Error('error')
        }
    }, [ userType])

    const confirmOneTimePassword = useCallback(async (email: string, password: string) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/${userType}/confirmPasswordVerificationToken`, {
                method: 'POST',
                body: JSON.stringify({
                    email,
                    passwordVerificationToken: password
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if (!response.ok) {
                throw new Error('Some error occured')
            }
            const data = await response.json()
            return data
        } catch (error) {
            throw new Error('some error occured')
        }
    }, [userType])

    const updatePassword = useCallback(async (email: string, newPassword: string, passwordVerificationToken: string) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/${userType}/updatePassword`, {
                method: 'PATCH',
                body: JSON.stringify({
                    email,
                    newPassword,
                    passwordVerificationToken
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if (!response.ok) {
                throw new Error('Some error occured')
            }
            const data = await response.json()
            return data
        } catch (error) {
            throw new Error('some error occured')
        }
    }, [userType])

    const resetPasswordVerificationToken = useCallback(async (email: string) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/${userType}/resetPasswordVerificationToken`, {
                method: 'PATCH',
                body: JSON.stringify({ email }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if (!response.ok) {
                throw new Error('Some error occured')
            }
            const data = await response.json()
            return data
        } catch (error) {
            throw new Error('some error occured')
        }
    }, [userType])

    return {
        signIn,
        forgotPassword,
        confirmOneTimePassword,
        updatePassword,
        resetPasswordVerificationToken
    };
};

export default useLoginSignupPasswordChange;
