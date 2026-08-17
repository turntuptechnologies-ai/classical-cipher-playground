import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// SPAはページ遷移してもブラウザが自動でスクロール位置をリセットしないため、
// パスが変わるたびに手動でページ上部に戻す。
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
