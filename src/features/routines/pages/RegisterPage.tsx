
import '../../../styles/RegisterPage.css';
import registerPic from "../../../assets/register_mainpic.png";
import { FcGoogle } from 'react-icons/fc';
import {UserProfile} from "../../../models/UserProfile.tsx";
import {useState} from "react";
import UserProfileForm from "./UserProfileForm.tsx";

const mockGoogleUser = {
    userName: 'Jane Doe',
    userEmail: 'jane.doe@gmail.com',
    userPhotoURL: 'https://i.pravatar.cc/150?img=47',
    birthDate: new Date('1995-06-15')
};

function RegisterPage() {

    const [user, setUser] = useState<UserProfile | null>(null);
    const handleGoogleSignIn = () => {

        const fullName = mockGoogleUser.userName.split(' ');

        setUser({
            uid: 'google123',
            userName: fullName[0] || '',
            userLastName: fullName.slice(1).join(' ') || '',
            userEmail: mockGoogleUser.userEmail,
            userPhotoURL: mockGoogleUser.userPhotoURL,
            userRole: 'client',
            birthDate: mockGoogleUser.birthDate,
            createdAt: new Date(),
        });
    };
    return (
        <div className="register-wrapper">
            <div className="left-panel">
                <div className="left-content">
                    <img src={registerPic} alt="Illustration" />
                </div>
            </div>

            <div className="right-panel">
                <div className="signup-card">
                    {user ? (
                        <UserProfileForm user={user} />
                    ) : (
                        <>
                            <h2>Sign up now</h2>
                            <button className="btn-google" onClick={handleGoogleSignIn}>
                                <FcGoogle size={20} />
                                Sign up with Google
                            </button>

                            <p className="terms-text">
                                By signing up, you agree to our <a href="#">Terms of use</a> and <a href="#">Privacy Policy</a>.
                            </p>

                            <p className="login-text">
                                Already have an account? <a href="#">Log in</a>
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
