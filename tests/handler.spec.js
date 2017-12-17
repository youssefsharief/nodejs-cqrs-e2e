const request = require('superagent')
const faker = require('faker')
const generateId = () => faker.random.uuid()

describe("E2E", function () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000
    it("should add successfully ", function (done) {
        const accountId = generateId()
        const createCommand = {
            accountNumber: 1234,
            accountId,
            businessName: faker.name.firstName(),
        }
        request.post('http://localhost:3000/createAccount').send(createCommand).end((err, res) => {
            expect(res.status).toBe(200)
            expect(res.body).toBe('ok')

            setTimeout(() => {
                request.get(`http://localhost:3001/accountDetailsById/${accountId}`).end((err, res) => {
                    expect(res.body.accountNumber).toBe(createCommand.accountNumber)
                    expect(res.body.accountId).toBe(createCommand.accountId)
                    expect(res.body.businessName).toBe(createCommand.businessName)
                    done()
                })
            }, 2000)




        })
    })


    it("should delete successfully ", function (done) {
        const accountId = generateId()
        const createCommand = {
            accountNumber: 1234,
            accountId,
            businessName: faker.name.firstName(),
        }
        const deleteCommand = {
            reason: 'dsd',
            accountId,
        }
        request.post('http://localhost:3000/createAccount').send(createCommand).end((err, res) => {
            request.post('http://localhost:3000/deleteAccount').send(deleteCommand).end((err, res) => {
                expect(res.status).toBe(200)
                expect(res.body).toBe('ok')

                setTimeout(() => {
                    request.get(`http://localhost:3001/accountDetailsById/${accountId}`).end((err, res) => {
                        expect(res.status).toBe(400)
                        expect(res.body.error).toBeTruthy()
                        done()
                    })
                }, 2000)
            })
        })
    })



    it("should not delete a previously deleted account ", function (done) {
        const accountId = generateId()
        const createCommand = {
            accountNumber: 1234,
            accountId,
            businessName: faker.name.firstName(),
        }
        const deleteCommand = {
            reason: 'dsd',
            accountId,
        }
        request.post('http://localhost:3000/createAccount').send(createCommand).end((err, res) => {
            request.post('http://localhost:3000/deleteAccount').send(deleteCommand).end((err, res) => {
                request.post('http://localhost:3000/deleteAccount').send(deleteCommand).end((err, res) => {
                    expect(res.body.error).toBeTruthy()
                    done()
                })
            })
        })
    })

    it("should approve successfully ", function (done) {
        const accountId = generateId()
        const createCommand = {
            accountNumber: 1234,
            accountId,
            businessName: faker.name.firstName(),
        }
        const approveAccount = {
            approvedBy: 'Name',
            accountId,
        }
        request.post('http://localhost:3000/createAccount').send(createCommand).end((err, res) => {
            request.post('http://localhost:3000/approveAccount').send(approveAccount).end((err, res) => {
                expect(res.status).toBe(200)
                setTimeout(() => {
                    request.get(`http://localhost:3001/accountDetailsById/${accountId}`).end((err, res) => {
                        expect(res.body.isApproved).toBe(true)
                        expect(res.body.approvedBy).toBe('Name')
                        expect(res.status).toBe(200)
                        done()
                    })
                }, 2000)
            })
        })
    })


    it("should update address successfully ", function (done) {
        const accountId = generateId()
        const createCommand = {
            accountNumber: 1234,
            accountId,
            businessName: faker.name.firstName(),
        }
        const updateAccountAddressCommand = {
            accountId, addressLine1: faker.address.streetName(),
            addressLine2: faker.address.streetName(), city: faker.address.city(), state: faker.address.state(),
            postcode: 12345, countryName: faker.address.country()
        }
        request.post('http://localhost:3000/createAccount').send(createCommand).end((err, res) => {
            request.post('http://localhost:3000/updateAccountAddress').send(updateAccountAddressCommand).end((err, res) => {
                expect(res.status).toBe(200)
                setTimeout(() => {
                    request.get(`http://localhost:3001/accountDetailsById/${accountId}`).end((err, res) => {
                        expect(res.body.addressLine1).toBe(updateAccountAddressCommand.addressLine1)
                        expect(res.body.addressLine2).toBe(updateAccountAddressCommand.addressLine2)
                        expect(res.body.city).toBe(updateAccountAddressCommand.city)
                        expect(res.body.countryName).toBe(updateAccountAddressCommand.countryName)
                        expect(res.body.postcode).toBe(updateAccountAddressCommand.postcode)
                        expect(res.body.state).toBe(updateAccountAddressCommand.state)
                        expect(res.status).toBe(200)
                        done()
                    })
                }, 2000)
            })
        })
    })



    it("should resinstate account successfully ", function (done) {
        const accountId = generateId()
        const createCommand = {
            accountNumber: 1234,
            accountId,
            businessName: faker.name.firstName(),
        }
        const deleteCommand = {
            reason: 'dsd',
            accountId,
        }
        const reinstateAccountCommand = {
            accountId
        }
        
        request.post('http://localhost:3000/createAccount').send(createCommand).end((err, res) => {
            request.post('http://localhost:3000/deleteAccount').send(deleteCommand).end((err, res) => {
                request.post('http://localhost:3000/reinstateAccount').send(reinstateAccountCommand).end((err, res) => {
                    expect(res.status).toBe(200)
                    setTimeout(() => {
                        request.get(`http://localhost:3001/accountDetailsById/${accountId}`).end((err, res) => {
                            expect(res.body.accountNumber).toBe(createCommand.accountNumber)
                            expect(res.body.accountId).toBe(createCommand.accountId)
                            expect(res.body.businessName).toBe(createCommand.businessName)
                            expect(res.status).toBe(200)
                            done()
                        })
                    }, 6000)
                })
            })
        })
    })

})