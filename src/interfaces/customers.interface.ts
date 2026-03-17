export interface Icustomer {
    name: string,
    email: string,
    phone: string,
    address: string,
    createdAt: Date,
    updatedAt: Date,
}
export interface IcustomerDocument extends Icustomer, Document {
    _id: string,
    name: string,
    email: string,
    phone: string,
    address: string,
    createdAt: Date,
    updatedAt: Date,

}