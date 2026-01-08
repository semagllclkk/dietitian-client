import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
} from "react";
import Cookies from "universal-cookie";
import { setToken } from "../../helper/api";

export type LoggedInUser = {
  id: number;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  accessToken: string;
};

export type LoggedInUserContextType = {
  loggedInUser: LoggedInUser | null;
  setLoggedInUser: Dispatch<React.SetStateAction<LoggedInUser | null>>;
};

const LoggedInUserContext = createContext<LoggedInUserContextType | null>(null);

interface Props {
  children: ReactNode;
}

export const LoggedInUserContextProvider = ({ children }: Props) => {
  let initialLoggedInUser: LoggedInUser | null = null;

  try {
    const cookies = new Cookies();
    const loggedInUserCookie = cookies.get("loggedInUser");

    let parsedUser: any = null;
    if (typeof loggedInUserCookie === "string") {
      try {
        parsedUser = JSON.parse(loggedInUserCookie);
      } catch (e) {
        parsedUser = null;
      }
    } else if (typeof loggedInUserCookie === "object" && loggedInUserCookie !== null) {
      parsedUser = loggedInUserCookie;
    }

    if (
      parsedUser &&
      parsedUser.accessToken &&
      parsedUser.role &&
      ["DIYETISYEN", "DANISAN", "ADMIN"].includes(parsedUser.role)
    ) {
      initialLoggedInUser = parsedUser as LoggedInUser;
      setToken(initialLoggedInUser.accessToken);
    } else {
      if (loggedInUserCookie) {
        const removeCookies = new Cookies();
        removeCookies.remove("loggedInUser");
      }
    }
  } catch (error) {
    const cookies = new Cookies();
    cookies.remove("loggedInUser");
    initialLoggedInUser = null;
  }

  const [loggedInUser, setLoggedInUser] = useState<LoggedInUser | null>(
    initialLoggedInUser
  );

  return (
    <LoggedInUserContext.Provider value={{ loggedInUser, setLoggedInUser }}>
      {children}
    </LoggedInUserContext.Provider>
  );
};

export default LoggedInUserContextProvider;

export function useLoggedInUsersContext() {
  const context = useContext(LoggedInUserContext);
  if (!context)
    throw Error(
      "useLoggedInUserContext must be within LoggedInUserContextProvider"
    );
  return context;
}
