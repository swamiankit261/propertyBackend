class ApiFeatures {

    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    search() {
        const keyword = this.queryString.keyword ? {
            $or: [
                { propertyType: { $regex: new RegExp(`.*${this.queryString.keyword}.*`, 'i') } },
                { propertyCategory: { $regex: new RegExp(`.*${this.queryString.keyword}.*`, 'i') } },
                { 'address.street': { $regex: new RegExp(`.*${this.queryString.keyword}.*`, 'i') } },
                { 'address.city': { $regex: new RegExp(`.*${this.queryString.keyword}.*`, 'i') } },
                { 'address.state': { $regex: new RegExp(`.*${this.queryString.keyword}.*`, 'i') } },
                { 'address.zipCode': { $regex: new RegExp(`.*${this.queryString.keyword}.*`, 'i') } }
                // { address: { $regex: new RegExp(`.*${this.queryString.keyword}.*`, 'i') } },

            ]
        } : {};
        this.query = this.query.find({ ...keyword });
        return this;
    }

    pagination(resultPerPage) {
        const page = Number(this.queryString.page) || 1;

        const skip = (page - 1) * resultPerPage;
        this.query = this.query.skip(skip).limit(resultPerPage);
        return this;
    }
}

module.exports = ApiFeatures;