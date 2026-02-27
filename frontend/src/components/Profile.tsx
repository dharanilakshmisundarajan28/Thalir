import AuthService from "../services/auth.service";
import { Navigate } from "react-router-dom";

const Profile = () => {
    const currentUser = AuthService.getCurrentUser();

    if (!currentUser) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="container">
            <header className="jumbotron">
                <h3>
                    <strong>{currentUser.username}</strong> Profile
                </h3>
            </header>
                    <p>
                <strong>User ID:</strong> {currentUser.userId || currentUser.id}
            </p>
            <p>
                <strong>Username:</strong> {currentUser.username}
            </p>
            <strong>Authorities:</strong>
            <ul>
                {currentUser.roles &&
                    currentUser.roles.map((role: string, index: number) => <li key={index}>{role}</li>)}
            </ul>
        </div>
    );
};

export default Profile;
