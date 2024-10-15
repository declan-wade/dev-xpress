import { Layout } from "antd";
const { Footer } = Layout;

export default function SiteFooter() {
  return (
    <Footer
      style={{ textAlign: "center", background: "rgba(128, 128, 128, 0.3)" }}
    >
      DevXpress © {new Date().getFullYear()} Codex Group WA. All Rights
      Reserved.
    </Footer>
  );
}
