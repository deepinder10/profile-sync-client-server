import "./App.css";
import UserProfile from "./containers/UserProfile";
import { UserProfileProvider } from "./context/UserProfileContext";

function App() {
	return (
		<UserProfileProvider>
			<UserProfile />
		</UserProfileProvider>
	);
}

export default App;
