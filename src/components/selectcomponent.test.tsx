import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SelectComponent from "./SelectComponent";

var selected: { id: number } = { id: 0 };
function handleSelect(sel: { id: number }) {
  selected = sel;
}
const renderComponent = () => {
  return render(<SelectComponent onChange={handleSelect} value={selected} />);
};
describe("SelectComponent unit test", () => {
  it("renders", async () => {
    renderComponent();
    let activator = screen.getByTestId("select_component__container");

    expect(activator).toBeInTheDocument();
    expect(screen.getByText("Angular")).not.toBeVisible();
    expect(screen.getByText("React")).not.toBeVisible();
    expect(screen.getByText("Vuejs")).not.toBeVisible();
    userEvent.click(activator);
    await waitFor(() => {
      expect(screen.getByText("Angular")).toBeVisible();
      expect(screen.getByText("React")).toBeVisible();
      expect(screen.getByText("Vuejs")).toBeVisible();
    });
  });
  describe("selecting", () => {
    beforeEach(() => {
      renderComponent();
      let activator = screen.getByTestId("select_component__container");
      userEvent.click(activator);
    });
    it("selects React and closes", async () => {
      await waitFor(() => {
        expect(screen.getByText("React")).toBeVisible();
      });
      userEvent.click(screen.getByText("React"));
      await waitFor(() => {
        expect(selected.id).toBe(1);
        expect(screen.getByText("React")).not.toBeVisible();
      });
    });
    it("selects Vuejs and closes", async () => {
      await waitFor(() => {
        expect(screen.getByText("Vuejs")).toBeVisible();
      });
      userEvent.click(screen.getByText("Vuejs"));
      await waitFor(() => {
        expect(selected.id).toBe(2);
        expect(screen.getByText("Vuejs")).not.toBeVisible();
      });
    });
    it("selects Angular and closes", async () => {
      await waitFor(() => {
        expect(screen.getByText("Angular")).toBeVisible();
      });
      userEvent.click(screen.getByText("Angular"));
      await waitFor(() => {
        expect(selected.id).toBe(0);
        expect(screen.getByText("Angular")).not.toBeVisible();
      });
    });
  });
});
