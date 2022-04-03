import React from "react";
import {
  render,
  fireEvent,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { Provider } from "react-redux";
import { createStore } from "redux";
import authReducer from "../redux/authReducer";
import MessageSubmit from "./MessageSubmit";
import * as apiCalls from "../api/apiCalls";

const defaultState = {
  id: 1,
  username: "user1",
  displayName: "display1",
  image: "profile1.png",
  password: "P4ssword",
  isLoggedIn: true,
};

let store;

const setup = (state = defaultState) => {
  store = createStore(authReducer, state);
  return render(
    <Provider store={store}>
      <MessageSubmit />
    </Provider>
  );
};

describe("MessageSubmit", () => {
  describe("Layout", () => {
    it("has textarea", () => {
      const { container } = setup();
      const textArea = container.querySelector("textarea");
      expect(textArea).toBeInTheDocument();
    });

    it("has image", () => {
      const { container } = setup();
      const image = container.querySelector("img");
      expect(image).toBeInTheDocument();
    });

    it("has textarea", () => {
      const { container } = setup();
      const textArea = container.querySelector("textarea");
      expect(textArea.rows).toBe(1);
    });

    it("displays user image", () => {
      const { container } = setup();
      const image = container.querySelector("img");
      expect(image.src).toContain("/images/profile/" + defaultState.image);
    });
  });
  describe("Interactions", () => {
    let textArea;
    const setupFocused = () => {
      const rendered = setup();
      textArea = rendered.container.querySelector("textarea");
      fireEvent.focus(textArea);
      return rendered;
    };

    it("displays 3 rows when focused to textarea", () => {
      setupFocused();
      expect(textArea.rows).toBe(3);
    });

    it("displays send message button when focused to textarea", () => {
      const { queryByText } = setupFocused();
      const sendButton = queryByText("Send");
      expect(sendButton).toBeInTheDocument();
    });

    it("displays Cancel button when focused to textarea", () => {
      const { queryByText } = setupFocused();
      const cancelButton = queryByText("Cancel");
      expect(cancelButton).toBeInTheDocument();
    });

    it("does not display Send button when not focused to textarea", () => {
      const { queryByText } = setup();
      const sendButton = queryByText("Send");
      expect(sendButton).not.toBeInTheDocument();
    });

    it("does not display Cancel button when not focused to textarea", () => {
      const { queryByText } = setup();
      const cancelButton = queryByText("Cancel");
      expect(cancelButton).not.toBeInTheDocument();
    });

    it("returns back to unfocused state after clicking the cancel", () => {
      const { queryByText } = setupFocused();
      const cancelButton = queryByText("Cancel");
      fireEvent.click(cancelButton);
      expect(queryByText("Cancel")).not.toBeInTheDocument();
    });

    it("calls postMessage with message request object when clicking Send", () => {
      const { queryByText } = setupFocused();
      fireEvent.change(textArea, { target: { value: "Test message content" } });

      const sendButton = queryByText("Send");

      apiCalls.postMessage = jest.fn().mockResolvedValue({});
      fireEvent.click(sendButton);

      expect(apiCalls.postMessage).toHaveBeenCalledWith({
        content: "Test message content",
      });
    });

    it("returns back to unfocused state after successful postMessage action", async () => {
      const { queryByText } = setupFocused();
      fireEvent.change(textArea, { target: { value: "Test message content" } });

      const sendButton = queryByText("Send");

      apiCalls.postMessage = jest.fn().mockResolvedValue({});
      fireEvent.click(sendButton);

      await waitFor(() => {
        expect(queryByText("Send")).not.toBeInTheDocument();
      });
    });

    it("clear content after successful postMessage action", async () => {
      const { queryByText } = setupFocused();
      fireEvent.change(textArea, { target: { value: "Test message content" } });

      const sendButton = queryByText("Send");

      apiCalls.postMessage = jest.fn().mockResolvedValue({});
      fireEvent.click(sendButton);

      await waitFor(() => {
        expect(queryByText("Test message content")).not.toBeInTheDocument();
      });
    });

    it("clears content after clicking cancel", () => {
      const { queryByText } = setupFocused();
      fireEvent.change(textArea, { target: { value: "Test message content" } });

      fireEvent.click(queryByText("Cancel"));

      expect(queryByText("Test message content")).not.toBeInTheDocument();
    });

    it("disables Send button when there is postMessage api call", async () => {
      const { queryByText } = setupFocused();
      fireEvent.change(textArea, { target: { value: "Test message content" } });

      const sendButton = queryByText("Send");

      const mockFunction = jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve({});
          }, 300);
        });
      });

      apiCalls.postMessage = mockFunction;
      fireEvent.click(sendButton);

      fireEvent.click(sendButton);
      expect(mockFunction).toHaveBeenCalledTimes(1);
    });

    it("disables Cancel button when there is postMessage api call", async () => {
      const { queryByText } = setupFocused();
      fireEvent.change(textArea, { target: { value: "Test message content" } });

      const sendButton = queryByText("Send");

      const mockFunction = jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve({});
          }, 300);
        });
      });

      apiCalls.postMessage = mockFunction;
      fireEvent.click(sendButton);

      const cancelButton = queryByText("Cancel");
      expect(cancelButton).toBeDisabled();
    });

    it("displays spinner when there is postMessage api call", async () => {
      const { queryByText, queryByRole } = setupFocused();
      fireEvent.change(textArea, { target: { value: "Test message content" } });

      const sendButton = queryByText("Send");

      const mockFunction = jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve({});
          }, 300);
        });
      });

      apiCalls.postMessage = mockFunction;
      fireEvent.click(sendButton);

      const spinner = queryByRole("status");
      expect(spinner).toBeInTheDocument();
    });

    it("enables Send button when postMessage api call fails", async () => {
      const { queryByText } = setupFocused();
      fireEvent.change(textArea, { target: { value: "Test message content" } });

      const sendButton = queryByText("Send");

      const mockFunction = jest.fn().mockRejectedValueOnce({
        response: {
          data: {
            validationErrors: {
              content: "It must have minimum 10 and maximum 5000 characters",
            },
          },
        },
      });

      apiCalls.postMessage = mockFunction;
      fireEvent.click(sendButton);

      await waitFor(() => {
        expect(queryByText("Send")).not.toBeDisabled();
      });
    });

    it("enables Cancel button when postMessage api call fails", async () => {
      const { queryByText } = setupFocused();
      fireEvent.change(textArea, { target: { value: "Test message content" } });

      const sendButton = queryByText("Send");

      const mockFunction = jest.fn().mockRejectedValueOnce({
        response: {
          data: {
            validationErrors: {
              content: "It must have minimum 10 and maximum 5000 characters",
            },
          },
        },
      });

      apiCalls.postMessage = mockFunction;
      fireEvent.click(sendButton);

      await waitFor(() => {
        expect(queryByText("Cancel")).not.toBeDisabled();
      });
    });

    it("enables Send button after successful postMessage action", async () => {
      const { queryByText } = setupFocused();
      fireEvent.change(textArea, { target: { value: "Test message content" } });

      const sendButton = queryByText("Send");

      apiCalls.postMessage = jest.fn().mockResolvedValue({});
      fireEvent.click(sendButton);

      await waitForElementToBeRemoved(sendButton);

      fireEvent.focus(textArea);
      await waitFor(() => {
        expect(queryByText("Send")).not.toBeDisabled();
      });
    });

    it("displays validation error for content", async () => {
      const { queryByText } = setupFocused();
      fireEvent.change(textArea, { target: { value: "Test message content" } });

      const sendButton = queryByText("Send");

      const mockFunction = jest.fn().mockRejectedValueOnce({
        response: {
          data: {
            validationErrors: {
              content: "It must have minimum 10 and maximum 5000 characters",
            },
          },
        },
      });

      apiCalls.postMessage = mockFunction;
      fireEvent.click(sendButton);

      await waitFor(() => {
        expect(
          queryByText("It must have minimum 10 and maximum 5000 characters")
        ).toBeInTheDocument();
      });
    });

    it("clears validation error after clicking cancel", async () => {
      const { queryByText, findByText } = setupFocused();
      fireEvent.change(textArea, { target: { value: "Test message content" } });

      const sendButton = queryByText("Send");

      const mockFunction = jest.fn().mockRejectedValueOnce({
        response: {
          data: {
            validationErrors: {
              content: "It must have minimum 10 and maximum 5000 characters",
            },
          },
        },
      });

      apiCalls.postMessage = mockFunction;
      fireEvent.click(sendButton);

      const error = await findByText(
        "It must have minimum 10 and maximum 5000 characters"
      );

      fireEvent.click(queryByText("Cancel"));

      expect(error).not.toBeInTheDocument();
    });

    it("clears validation error after content is changed", async () => {
      const { queryByText, findByText } = setupFocused();
      fireEvent.change(textArea, { target: { value: "Test message content" } });

      const sendButton = queryByText("Send");

      const mockFunction = jest.fn().mockRejectedValueOnce({
        response: {
          data: {
            validationErrors: {
              content: "It must have minimum 10 and maximum 5000 characters",
            },
          },
        },
      });

      apiCalls.postMessage = mockFunction;
      fireEvent.click(sendButton);
      const error = await findByText(
        "It must have minimum 10 and maximum 5000 characters"
      );

      fireEvent.change(textArea, {
        target: { value: "Test message content updated" },
      });

      expect(error).not.toBeInTheDocument();
    });
  });
});

console.error = () => {};
