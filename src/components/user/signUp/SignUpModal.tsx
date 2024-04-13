import React, { Fragment } from 'react';
import CustomerSignUpModal from './CustomerModal';
import DealerSignUpModal from './DealerModal';

interface PropsType {
    openSignInSignUpModalSetter: (input: 'sign-in' | 'sign-up' | null) => void,
    selectedUserTypeSetter: (input: 'dealer' | 'customer' | null) => void,
    selectedUserType: 'dealer' | 'customer' | null
}

const SignUpModal: React.FC<PropsType> = ({
    openSignInSignUpModalSetter,
    selectedUserType,
    selectedUserTypeSetter
}) => {

    return (
        <Fragment>
            {selectedUserType === 'customer' &&
                <CustomerSignUpModal
                    selectedUserTypeSetter={selectedUserTypeSetter}
                    openSignInSignUpModalSetter={openSignInSignUpModalSetter}
                />}

            {selectedUserType === 'dealer' &&
                <DealerSignUpModal
                    selectedUserTypeSetter={selectedUserTypeSetter}
                    openSignInSignUpModalSetter={openSignInSignUpModalSetter}
                />}
        </Fragment>
    );
};

export default SignUpModal
