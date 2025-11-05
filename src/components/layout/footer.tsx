import Container from "../ui/container";

export default function Footer() {
  return (
    <footer className="text-center py-4">
      <Container>
        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} NextBlog. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
