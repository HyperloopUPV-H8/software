// Root component. Wraps all pages in the shared AppLayout (sidebar + header).
// The active view mode (Normal / Simple) is encoded in the URL so each mode
// can have a completely independent UI. Navigating to "/" redirects to
// "/simple" — Simple (Plot Studio) is the default mode for now because
// Normal mode isn't developed yet; switch this back to "/normal" once it is.
import { Navigate, Route, Routes } from "react-router";
import AppLayout from "./layout/AppLayout";
import NormalPage from "./pages/NormalPage";
import SimplePage from "./pages/SimplePage";

const App = () => {
  return (
    <AppLayout>
      <Routes>
        <Route index element={<Navigate to="/simple" replace />} />
        <Route path="/normal" element={<NormalPage />} />
        <Route path="/simple" element={<SimplePage />} />
      </Routes>
    </AppLayout>
  );
};

export default App;
