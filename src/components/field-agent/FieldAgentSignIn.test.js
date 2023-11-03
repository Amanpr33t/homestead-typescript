
import { render, screen, fireEvent } from '@testing-library/react';
import FieldAgentSignIn from './FieldAgentSignIn';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';

describe("Tests without any http requests", () => {

    test('These elements are rendered initially', () => {
        render(<BrowserRouter><FieldAgentSignIn /></BrowserRouter>)
        const fieldAgentEmailInputElement = screen.getByRole('textbox', { name: /field agent email/i })
        expect(fieldAgentEmailInputElement).toBeInTheDocument()

        const fieldAgentPasswordInputElement = screen.getByLabelText(/field agent password/i)
        expect(fieldAgentPasswordInputElement).toBeInTheDocument()

        const signInButtonElement = screen.getByRole('button', { name: /sign in/i })
        expect(signInButtonElement).toBeInTheDocument()

        const forgotPasswordButtonElement = screen.getByRole('button', { name: /click here/i })
        expect(forgotPasswordButtonElement).toBeInTheDocument()
    })

    test('When the user signs in', () => {
        userEvent.setup()
        render(<BrowserRouter><FieldAgentSignIn /></BrowserRouter>)
        const fieldAgentEmailInputElement = screen.getByRole('textbox', { name: /field agent email/i })
        expect(fieldAgentEmailInputElement).toBeInTheDocument()

        const fieldAgentPasswordInputElement = screen.getByLabelText(/field agent password/i)
        expect(fieldAgentPasswordInputElement).toBeInTheDocument()

        const signInButtonElement = screen.getByRole('button', { name: /sign in/i })
        expect(signInButtonElement).toBeInTheDocument()

        fireEvent.change(fieldAgentEmailInputElement, { target: { value: 'demo@gmail.com' } })
        expect(fieldAgentEmailInputElement.value).toBe('demo@gmail.com')

        /*fireEvent.change(fieldAgentPasswordInputElement, { target: { value: 'password' } })
        expect(fieldAgentPasswordInputElement).toBe('password')*/
    })


    test('When the user has forgotten password and clicks the button to update password', () => {
        userEvent.setup()
        render(<BrowserRouter><FieldAgentSignIn /></BrowserRouter>);

        const forgotPasswordButtonElement = screen.getByRole('button', { name: /click here/i })
        expect(forgotPasswordButtonElement).toBeInTheDocument()

        act(async () => {
            await userEvent.click(forgotPasswordButtonElement)
                .then(async () => {
                    const fieldAgentEmailInputElement = screen.getByRole('textbox', { name: /field agent email/i })
                    expect(fieldAgentEmailInputElement).toBeInTheDocument()

                    const sendOTPToEmailButtonElement = screen.getByRole('button', { name: /send otp to email/i })
                    expect(sendOTPToEmailButtonElement).toBeInTheDocument()

                    const signInWithExistingAccountButtonElement = screen.getByRole('button', { name: /sign in with an existing account/i })
                    expect(signInWithExistingAccountButtonElement).toBeInTheDocument()

                    await userEvent.click(signInWithExistingAccountButtonElement)
                        .then(() => {
                            const fieldAgentPasswordInputElement = screen.getByLabelText(/field agent password/i)
                            expect(fieldAgentPasswordInputElement).toBeInTheDocument()
                        })
                })
        })
    })
})


