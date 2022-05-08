# reingntest
Project developed in response to a talent adquisition test with the following requeriments:

### FUNCTIONALITY
    ● The selected filter should persist on the local storage
    ● The favorited posts should persist on the local storage
    ● The web app is expected to work as a responsive web application
    ● When clicking on the row, a new tab should be open with the link of the post(story_url)
    ● Clicking on the “like button” should not trigger the opening of the post URL link
    ● When hovering on the row, apply opacity to the entire row and its children (texts,icons, like button, etc)
### BONUS
    ● Implement unit testing
    ● Good use of Typescript
    ● Pagination as infinite scroll
### WHAT WILL BE EVALUATED?
    ● Documentation
    ● Testing
    ● Clean code
    ● Software design
    ●  Git history
    ● Solution deployed
### DELIVERABLES
    ● Netlify link to the deployed web application
    ● Public GitHub / GitLab / Bitbucket repository URL

# Setup
[Vite](https://vitejs.dev/) whas used to build this [React](https://es.reactjs.org/) project.

## Install
```
npm install
```

## Run
### Development
```
npm run dev
```

### Production
```
npm run build
npm run preview
```

## Testing
### Unit testing for components
with [vitest]()
```
npm run test
```
GUI with [vitest + ui]()
```
npm run test:ui
```
### Integration testing for views with [Cypress]()
```
npm run cypress-test
```

## Usage
The project main view displays new's information fetched from a public API:
https://hn.algolia.com/api/v1/search_by_date

The information is diplayed as a set of cards which are grouped by standard pagination and can be explored dynamically by scrolling through them.

The subject of the news can be selected exclusively in a selector placed at the top left corner of the page content. Available values are:
- Angular
- React
- Vue.js

Each one of the displayed item-cards is also a link to the new it represents. This link will always open in a new tab when the card is clicked.

The items can be marked as favorites by clicking the heart appearing at the right of each item-card. Once it's marked as favorite, the heart will be filled.

Favorite items can be seen all together (despite it's subject) by switching the tab appearing at the top-center of the content.

In favorites view, tggling the heart again will cause the item to be removed immediately from favorites list

## Components
The project uses 4 controlled [components](https://shopify-1.gitbook.io/react/2.-intermediate/controlled-and-uncontrolled-components). 

### [ItemComponent.tsx](src/components/ItemComponent.tsx)
- It handles the controlled property "favorite".
- It's a card for resuming information about one new, such as title, author and date of creation. 
- A link to the whole new.
- As a [test requisite](#functionality), it decreases opacity to 50% when hover.

### [PaginationComponent.tsx](src/components/PaginationComponent.tsx)

- Handles the pagination through the controlled prop "page".
- Supports page truncating for a large ammount of pages.

### [SelectComponent.tsx](src/components/SelectComponent.tsx)
- It handles the controlled property "selection", related to the new's subject.
- It's a card for resuming information about one new, such as title, author and date of creation. 
- An external link to the whole new.


### [TabComponent.tsx](src/components/TabComponent.tsx)

- It handles the controlled property "tab", used for toggle favorites viex.

## Views
