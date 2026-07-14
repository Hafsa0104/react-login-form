import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

describe("Authentication Form", () => {
  test("renders Login form by default", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { name: /login/i })
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("Email")
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("Password")
    ).toBeInTheDocument();
  });

  test("opens Signup form", () => {
    render(<App />);

    fireEvent.click(
      screen.getByRole("button", { name: /sign up/i })
    );

    expect(
      screen.getByRole("heading", { name: /signup/i })
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("Full Name")
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("Confirm Password")
    ).toBeInTheDocument();
  });

  test("returns from Signup to Login", () => {
    render(<App />);

    fireEvent.click(
      screen.getByRole("button", { name: /sign up/i })
    );

    fireEvent.click(
      screen.getByRole("button", { name: /^login$/i })
    );

    expect(
      screen.getByRole("heading", { name: /login/i })
    ).toBeInTheDocument();
  });

  test("opens Reset Password form", () => {
    render(<App />);

    fireEvent.click(
      screen.getByRole("button", { name: /forgot password/i })
    );

    expect(
      screen.getByRole("heading", { name: /reset password/i })
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("New Password")
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("Confirm New Password")
    ).toBeInTheDocument();
  });

  test("returns from Reset Password to Login", () => {
    render(<App />);

    fireEvent.click(
      screen.getByRole("button", { name: /forgot password/i })
    );

    fireEvent.click(
      screen.getByRole("button", { name: /back to login/i })
    );

    expect(
      screen.getByRole("heading", { name: /login/i })
    ).toBeInTheDocument();
  });
});