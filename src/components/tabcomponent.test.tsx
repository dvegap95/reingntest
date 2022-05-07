import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TabComponent from "./TabComponent";

var tab = {id:0};
function handleChange(t:{id:number}){
    tab = t;
}
describe("TabComponent unit test",()=>{
    beforeEach(()=>{
        render(<TabComponent onChange={handleChange} value={tab}/>)
    })
    it("renders",()=>{
        expect(screen.getByText("My faves")).toBeVisible();
        expect(screen.getByText("All")).toBeVisible();
    })
    it("works",async()=>{
        expect(tab.id).toBe(0);
        userEvent.click(screen.getByText("My faves"))
        await waitFor(()=>{
            expect(tab.id).toBe(1);
        })
        userEvent.click(screen.getByText("All"))
        await waitFor(()=>{
            expect(tab.id).toBe(0);
        })
    })
})