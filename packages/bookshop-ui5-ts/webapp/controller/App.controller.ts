import Controller from "sap/ui/core/mvc/Controller";
import JSONModel from "sap/ui/model/json/JSONModel";
import Filter from "sap/ui/model/Filter";
import FilterType from "sap/ui/model/FilterType";
import FilterOperator from "sap/ui/model/FilterOperator";
import MessageToast from "sap/m/MessageToast";
import type { ListItemBase$PressEvent } from "sap/m/ListItemBase";
import type { SearchField$LiveChangeEvent, SearchField$SearchEvent } from "sap/m/SearchField";
import ListBinding from "sap/ui/model/ListBinding";
import { ObjectBindingInfo } from "sap/ui/base/ManagedObject";
import { Input$LiveChangeEvent } from "sap/m/Input";

/**
 * @namespace bookshop.ui5.ts.controller
 */
export default class AppController extends Controller {

	public onInit(): void {
		this.getView().setModel(
			new JSONModel({
				quantity: 1,
				status: "",
			}),
			"order"
		);
	}
	
	public onSelect(oEvent?: ListItemBase$PressEvent): void {
		const selectedBook = this.byId("selectedBook"),
			oModel = this.getView().getModel("order") as JSONModel;
		selectedBook.bindElement((oEvent ? oEvent.getSource().getBindingContext().getPath() : ""));
		// reset the order information
		oModel.setProperty("/quantity", 1);
		oModel.setProperty("/selectedItemData", oEvent?.getSource().getBindingContext().getObject());
	}

	public async onSubmitOrder(): Promise<void> {
		const view = this.getView(),
			orderModel = view.getModel("order"),
			i18nModel = view.getModel("i18n");
		// fetch API (/!\ in Cloud Portal scenarios not covered by doorway mapping)
		fetch("/browse/submitOrder", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				book: orderModel.getProperty("/selectedItemData/ID"),
				quantity: orderModel.getProperty("/quantity"),
			}),
		})
		.then((response) => {
			MessageToast.show(i18nModel.getProperty(response.ok ? "OrderSuccessful" : "OrderError"));
			this.getView().getModel().refresh();
		})
		.catch(() => {
			MessageToast.show(i18nModel.getProperty("OrderError"));
			this.getView().getModel().refresh();
		});
	}

	public onSearch(oEvent: SearchField$LiveChangeEvent): void {
		const sValue = oEvent.getParameter("newValue"),
			oFilter = new Filter("title", FilterOperator.Contains, sValue);
		(this.byId("booksTable").getBinding("items") as ListBinding).filter(oFilter, FilterType.Application);
		this.onSelect(); // reset the selection
	}
	
}
