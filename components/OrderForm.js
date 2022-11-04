import React, { useEffect, useState } from 'react'
import { Flex, Input, Heading, Spinner, Divider, Button, Text, InputGroup, InputLeftElement, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, FormErrorMessage, Alert, AlertIcon, CloseButton, FormControl } from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'
import ListItem from './ListItem'
import { motion } from 'framer-motion'
import axios from 'axios'
import SearchItem from './SearchItem'

export default function OrderForm({ todayDate }) {
    const [products, setProducts] = useState([])
    const [searchInput, setSearchInput] = useState('')
    const [chosenProduct, setChosenProduct] = useState({})
    const [qntyInput, setQntyInput] = useState(1)
    const [itemList, setItemList] = useState([])
    const [totalPrice, setTotalPrice] = useState('')
    const [nameInput, setNameInput] = useState('')
    const [dateInput, setDateInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [succeedAlert, setSucceedAlert] = useState(false)
    const [nameInputError, setNameInputError] = useState(false)
    const [productsError, setProductsError] = useState(false)
    const [shouldResetPageSucceed, setShouldResetPageSucceed] = useState(false)
    const [shouldResetPageError, setShouldResetPageError] = useState(false)

    useEffect(() => {
        setSucceedAlert(false)
        setLoading(false)
    }, [])

    const onChangeNameInput = (e) => {
        if (nameInputError === true) {
            setNameInputError(false)
        }
        if (succeedAlert === true) {
            setSucceedAlert(false)
        }
        if (e.target.value.trim() !== '' || !e.target.value) {
            setNameInput(e.target.value)
        } else {
            setNameInput('')
        }
    }

    const onChangeDateInput = (e) => {
        setDateInput(e.target.value)
    }

    const onSearchInputChange = (e) => {
        setSearchInput(e.target.value)
    }

    const onChooseItem = (item) => {
        setChosenProduct(item)
        setSearchInput(item.name)
        setProducts([])
        setQntyInput(1)
    }

    const onNumInputChange = (e) => {
        setQntyInput(e)
    }


    const addListItem = (item) => {
        setProductsError(false)
        const itemListNames = itemList.map((item) => {
            return item.name
        })

        if (itemList.length > 0 && itemListNames.includes(item.name)) {
            return
        } else {
            setChosenProduct({})
            setSearchInput('')
            const newListItem = {
                product_id: item.product_id,
                name: item.name,
                price: item.price,
                qnty_stock: item.qnty_stock,
                qnty: qntyInput,
            }
            setItemList([...itemList, newListItem])
        }

    }

    const removeListItem = async (name) => {
        const newItemList = await itemList.filter((item) => {
            return item.name !== name
        })

        await setItemList(newItemList)
    }

    useEffect(() => {
        if (searchInput !== '' && !chosenProduct.name) {
            axios.get(`/api/products?name=${searchInput}`)
                .then((res) => {
                    setProducts(res.data.products.filter((product) => { return product.qnty_stock > 0 }).filter((product) => { return !itemList.map((item) => { return item.name }).includes(product.name)}))
                })
                .catch((err) => {
                    setProducts([])
                })
        } else if (chosenProduct.name && searchInput !== chosenProduct.name) {
            setChosenProduct({})
        } else {
            setProducts([])
        }

    }, [searchInput])

    useEffect(() => {
        if (itemList.length > 0) {
            const itemListPrices = itemList.map((item) => {
                return item.price * (item.qnty ? item.qnty : 1)
            })
            const total = itemListPrices.reduce((partialSum, a) => partialSum + a, 0)
            setTotalPrice(Number(total).toFixed(2))
        } else {
            setTotalPrice(0)
        }
    }, [itemList])


    const onChangeQntyInput = (name, qnty_input) => {
        const newItemList = itemList.map((item) => {
            if (item.name === name) {
                return { ...item, qnty: qnty_input }
            }
            return item
        })

        setItemList(newItemList)
    }

    useEffect(() => {
        if (shouldResetPageSucceed) {
            setItemList([])
            setNameInput('')
            setSearchInput('')
            setDateInput(todayDate)
            setChosenProduct({})
            setLoading(false)
            setSucceedAlert(true)
            setNameInputError(false)
            setProductsError(false)
            setShouldResetPageSucceed(false)
        }
    }, [shouldResetPageSucceed])

    useEffect(() => {
        if (shouldResetPageError) {
            setItemList([])
            setNameInput('')
            setSearchInput('')
            setDateInput(todayDate)
            setChosenProduct({})
            setLoading(false)
            setNameInputError(false)
            setProductsError(false)
            setShouldResetPageError(false)
        }
    }, [shouldResetPageError])

    const orderItems = (client_name, delivery_date, products) => {
        if (client_name.trim().length === 0) {
            setNameInputError(true)
        } else if (products.length === 0) {
            setProductsError(true)
        } else if (client_name && products.length > 0) {
            (delivery_date === '' ? delivery_date = todayDate : null)
            setLoading(true)
            const body = {
                client_name,
                delivery_date,
                products
            }
            axios.post('/api/orders', body,)
                .then((res) => {
                    setShouldResetPageSucceed(true)
                })
                .catch((err) => {
                    alert('Estoque insuficiente, tente novamente.')
                    setShouldResetPageError(true)
                })
        } else {
            return
        }
    }

    return (
        <Flex justify={'center'} marginY={'10vh'}>
            <Flex w={{ base: '95%', lg: '70%' }} padding={{ base: '1rem', lg: '2rem' }} boxShadow={'xl'} borderRadius={'16px'} bg={'#E9F9F3'} flexDir={'column'} align={'center'} gap={{ base: '1.5rem', lg: '3rem' }}>
                <Flex align={'flex-start'} gap={{ base: '15px', lg: '50px' }} justify={'flex-start'} w={'100%'} flexWrap={'wrap'} h={{ base: 'auto', lg: '4vh' }}>
                    <Text fontWeight={{ base: '700', lg: '600' }} fontSize={{ base: '1rem', lg: '1.2rem' }} w={{ base: '40%', lg: '21%' }} textAlign={{ base: 'left', lg: 'right' }}>
                        Nome:
                    </Text>
                    <FormControl isInvalid={nameInputError} w={{ base: '100%', lg: '30%' }}>
                        <Input variant='outline' placeholder='Nome' onChange={(e) => onChangeNameInput(e)} value={nameInput}></Input>
                        <FormErrorMessage>
                            Nome inválido.
                        </FormErrorMessage>
                    </FormControl>
                </Flex>
                <Flex align={'center'} gap={{ base: '15px', lg: '50px' }} justify={'flex-start'} w={'100%'} flexWrap={'wrap'}>
                    <Text fontWeight={{ base: '700', lg: '600' }} fontSize={{ base: '1rem', lg: '1.2rem' }} w={{ base: '40%', lg: '21%' }} textAlign={{ base: 'left', lg: 'right' }}>
                        Data de entrega:
                    </Text>
                    <Flex w={{ base: '100%', lg: '30%' }}>
                        <Input
                            value={dateInput !== '' ? dateInput : todayDate}
                            size="md"
                            type="date"
                            min={todayDate}
                            onChange={(e) => onChangeDateInput(e)}
                        />
                    </Flex>
                </Flex>
                <Flex align={'center'} gap={{ base: '15px', lg: '50px' }} justify={'flex-start'} w={'100%'} flexWrap={'wrap'}>
                    <Text fontWeight={{ base: '700', lg: '600' }} fontSize={{ base: '1rem', lg: '1.2rem' }} w={{ base: '100%', lg: '21%' }} textAlign={{ base: 'left', lg: 'right' }}>
                        Adicionar produto:
                    </Text>
                    <Flex flexDir={'column'} w={{ base: '100%', lg: '30%' }}>
                        <InputGroup >
                            <InputLeftElement
                                pointerEvents='none'
                                children={<SearchIcon color='gray.300' />}
                            />
                            <Input value={searchInput} placeholder='Nome do produto' onChange={(e) => onSearchInputChange(e)} />
                        </InputGroup>
                        {(products.length > 0 && !chosenProduct.name) && <Flex flexDir={'column'} zIndex={'1'} borderRadius={'8px'} padding={'1rem'} gap={'1rem'} position={'absolute'} bg={'#51B591'} marginTop={'40px'} color={'white'}>
                            {(products.length > 0 && !chosenProduct.name) && products.map((item) => {
                                return <SearchItem
                                    key={item.product_id}
                                    name={item.name}
                                    onClick={() => onChooseItem(item)}
                                />
                            })}
                        </Flex>}
                    </Flex>
                    {chosenProduct.name && <NumberInput defaultValue={1} w={{ base: '27%', lg: '8%' }} min={1} max={chosenProduct.qnty_stock} onChange={(e) => onNumInputChange(e)}>
                        <NumberInputField />
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>}
                    {chosenProduct.name && <Text fontWeight={'500'} fontSize={{ base: '1rem', lg: '1.1rem' }} textAlign={'center'} w={{ base: '35%', lg: '15%' }}>
                        Estoque: {chosenProduct.qnty_stock}
                    </Text>}
                    {chosenProduct.name && <Button bg={'#51B591'} color={'white'} _hover={{ bg: '#1A7855' }} as={motion.button} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => addListItem(chosenProduct)} size={{ base: 'sm', lg: 'md' }}>
                        Adicionar
                    </Button>}

                </Flex>
                <Divider w={'90%'} />
                <Flex minH={{base:'90vh', lg:'80vh'}} w={'100%'} flexDir={'column'} gap={{ base: '1.5rem', lg: '3rem' }}>
                    <Text fontWeight={'600'} fontSize={{ base: '1rem', lg: '1.2rem' }} w={{ base: '100%', lg: '21%' }} textAlign={{ base: 'left', lg: 'right' }}>
                        Lista de compras:
                    </Text>
                    <Flex w={{ base: '100%', lg: '80%' }} border={'1px solid gray'} borderRadius={'16px'} alignSelf={'center'} minH={'60%'} flexDir={'column'} padding={{ base: '0.5rem', lg: '1rem' }} gap={{ base: '0.5rem', lg: '1rem' }}>
                        {itemList.length > 0 && itemList.map((item) => {
                            return <ListItem
                                key={item.product_id}
                                id={item.product_id}
                                name={item.name}
                                price={item.price}
                                qnty={item.qnty}
                                qnty_stock={item.qnty_stock}
                                removeListItem={removeListItem}
                                onChangeQntyInput={onChangeQntyInput} 
                                />
                        })}
                        {productsError && <Alert status='error' variant='solid' fontWeight={'700'} borderRadius={'16px'} w={{base:'65%', lg: '20%'}} alignSelf={'center'} marginY={'auto'}><AlertIcon />Carrinho vazio !</Alert>}
                    </Flex>
                    <Flex justify={'space-between'} w={{ base: '100%', lg: '70%' }} alignSelf={'center'} flexDir={{ base: 'column', lg: 'row' }} gap={{ base: '1rem', lg: 0 }}>
                        <Text fontSize={{ base: '1rem', lg: '1.5rem' }} fontWeight={'500'}>
                            Preço total do carrinho: {totalPrice ? 'R$' + totalPrice : 'R$ ' + 0}
                        </Text>
                        <Flex gap={'10px'} align={'center'} w={{ base: '100%', lg: '25%' }} justify={{ base: 'flex-start', lg: 'space-between' }}>
                            <Button bg={'#51B591'} color={'white'} size={{ base: 'md', lg: 'lg' }} _hover={{ bg: '#1A7855' }} _active={{ bg: '#1A7855' }} as={motion.button} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => orderItems(nameInput, dateInput, itemList)}>
                                Finalizar compra
                            </Button>
                            {loading && <Spinner />}
                        </Flex>
                    </Flex>
                    {succeedAlert && <Flex alignSelf={'center'}>
                        <Alert status='success' variant='solid' fontWeight={'700'} borderRadius={'16px'} w={'255px'}>
                            <AlertIcon />
                            Compra efetuada !
                            <CloseButton marginLeft={'15px'} onClick={() => setSucceedAlert(false)} />
                        </Alert>
                    </Flex>}
                </Flex >
            </Flex>
        </Flex>

    )
}

