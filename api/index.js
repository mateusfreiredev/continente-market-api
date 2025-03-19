const express = require('express')
const axios = require("axios")
const cheerio = require("cheerio")

const app = express()

app.use(express.json())

async function getProductByURL(URL) {
    const response = await axios(URL)
    
    const html = response.data
    
    const $ = cheerio.load(html)
    
    const name = $(".pwc-h3.col-h3.product-name.pwc-font--primary-extrabold.mb-0").text().trim()
    const brand = $('.ct-pdp--brand.col-pdp--brand').text().trim() 
    const price = $(".value").attr('content')
    const quantity = $(".ct-pdp--unit.col-pdp--unit").text().trim()
    
    const product = { name, brand, price, quantity }

    return product
}

app.post('/', async (req, res) => {
    
    const { URL } = req.body
    
    if(typeof URL !== 'string'){
        return res.status(400).json({ message: 'Invalid request!' })
    }

    const selectedProduct = await getProductByURL(URL)

    res.status(200).json(selectedProduct)
})

app.listen(process.env.PORT || 3000, () => console.log(`Server started!`))

module.exports = app