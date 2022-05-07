import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ItemComponent, { Hit } from "./ItemComponent";

let testSubject = {
  author: "arjinium",
  comment_text:
    "Location: Mumbai, India<p>Remote: Yes, Strongly Preferred<p>Willing to relocate: No<p>Technologies: Python, Web Application Frameworks (Django, Flask, Tornado), REST APIs (DRF), Postgresql, MySQL, HTML, CSS, Heroku, Vanilla JS, Frontend Frameworks (VueJS), Linux, Docker.<p>Résumé &#x2F; CV &#x2F; Portfolio: Full CV and details of Open Source contributions available on request<p>Email: black11shadow@gmail.com<p>I&#x27;m a Backend Python Developer with 6 years of experience building web app backends and APIs. Have been working on Open source applications for 5 out of 6 years of work. I’m looking for a permanent or contract remote position as a backend&#x2F;fullstack developer.",
  created_at: "2020-08-05T04:15:50.000Z",
  created_at_i: 1596600950,
  num_comments: null,
  objectID: "24057213",
  parent_id: 24038518,
  points: null,
  story_id: 24038518,
  story_text: null,
  story_title: "Ask HN: Who wants to be hired? (August 2020)",
  story_url: "/other-url",
  title: null,
  url: null,
};
var isFavorite = false;
function handleFavorite(fav: boolean) {
  isFavorite = fav;
}
const renderComponent = () => {
  return render(
    <ItemComponent
      favorite={isFavorite}
      onFavoriteChanged={handleFavorite}
      hit={testSubject}
    />
  );
};
describe("ItemComponent unit test", () => {
  it("renders", async () => {
    renderComponent();
    expect(screen.getByTestId("item_component__faves")).toBeInTheDocument();
    expect(screen.getByTestId("item_component__container")).toBeInTheDocument();
    expect(screen.getByText(testSubject.story_title)).toBeInTheDocument();
    expect(
      screen.getByTestId("item_component__subtitle").textContent
    ).toContain(testSubject.author);
  });
  it("togles faves to true", async () => {
    renderComponent();
    let component: HTMLImageElement = screen.getByTestId(
      "item_component__faves"
    );
    expect(component.src).toContain("favorite-2");
    userEvent.click(component);
    await waitFor(() => {
      expect(isFavorite).toBe(true);
    });
  });
  it("togles faves to false", async () => {
    expect(isFavorite).toBe(true);
    renderComponent();
    let component: HTMLImageElement = screen.getByTestId(
      "item_component__faves"
    );
    expect(component.src).toContain("favorite-3");
    userEvent.click(component);
    await waitFor(() => {
      expect(isFavorite).toBe(false);
    });
  });
});
