import UIComponent from "sap/ui/core/UIComponent"

/**
 * @namespace bookshop.ui5.ts
 */
export default class Component extends UIComponent {
    public static metadata = {
        interfaces: ["sap.ui.core.IAsyncContentCreation"],
        manifest: "json",
    };

    public init(): void {
        // call the base component's init function
        super.init();
    }
}
