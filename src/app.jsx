import Routes from "@/routes/index";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <Routes />
      <Toaster richColors={true} />
    </>
  );
}

export default App;
