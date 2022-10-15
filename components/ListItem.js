import React, { useState, useEffect } from 'react'
import { Flex, Spacer, Text, Heading, Link, Button, Input, useNumberInput, HStack, Divider, IconButton } from '@chakra-ui/react'
import { DeleteIcon } from '@chakra-ui/icons'
import { motion } from 'framer-motion'

export default function ListItem({ name, price, qnty, qnty_stock, removeListItem, onChangeQntyInput }) {
    const [ shouldRemove, setShouldRemove] = useState(false)

    useEffect(() => {
        if (shouldRemove) {
            removeListItem(name)
            setShouldRemove(false)
        }

    }, [shouldRemove])

    const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
        useNumberInput({
            step: 1,
            defaultValue: qnty ? qnty : 1,
            min: 1,
            max: qnty_stock,
        })

    const inc = getIncrementButtonProps()
    const dec = getDecrementButtonProps()
    const input = getInputProps()

    useEffect(() => {
        onChangeQntyInput(name, input.value)
    })

    const onClickRemove = () => {
        setShouldRemove(true)
    }

    return (
        <>
            <Flex w={'100%'} px={{ base: '1%', md: '5%', lg: '5%' }} align={{ base: 'flex-start', lg: 'center' }} justify={'space-between'} flexDir={{ base: 'column', lg: 'row' }}>
                <Flex flexDir={'column'} w={{ base: '100%', md: '50%', lg: '50%' }} >
                    <Text overflow={'hidden'} textOverflow={'ellipsis'} whiteSpace={'nowrap'} fontSize={{ base: '0.8rem', lg: '1rem' }}>
                        {name}
                    </Text>
                    <Text fontSize={{ base: '0.8rem', lg: '1rem' }}>
                        R${price}
                    </Text>
                </Flex>
                <Flex align={'center'} gap={{ base: '15px', lg: '10px' }} w={'50%'} justify={'space-between'}>
                    <Flex gap={'10px'}>
                        <HStack maxW='175px' >
                            <Button {...dec} bg={'gray.300'} borderLeftRadius={'100%'} h={{ base: '30px', lg: '35px' }} _hover={{ bg: 'gray.400' }}>
                                -
                            </Button>
                            <Input {...input} textAlign={'center'} h={{ base: '30px', lg: '35px' }} w={{ base: '60px' }} />
                            <Button {...inc} bg={'gray.300'} h={{ base: '30px', lg: '35px' }} borderRightRadius={'100%'} _hover={{ bg: 'gray.400' }}>
                                +
                            </Button>
                        </HStack>
                        <IconButton
                            colorScheme='red'
                            size='sm'
                            icon={<DeleteIcon />}
                            as={motion.button}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => onClickRemove()}
                        />
                    </Flex>
                    <Flex w={{ base: '15%', lg: '35%' }}>
                        <Text>
                            Total: R${(input.value * price).toFixed(2)}
                        </Text>
                    </Flex>
                </Flex>
            </Flex>
            <Divider />
        </>
    )
}
