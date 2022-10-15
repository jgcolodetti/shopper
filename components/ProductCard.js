import React from 'react'
import { Flex, Spacer, Text, Heading, Link, Button } from '@chakra-ui/react'

export default function ProductCard({ product_id, name, price, qnty_stock }) {
    return (
        <Flex bg={'white'} gap={'0.5rem'} padding={'1rem'} boxShadow={'md'} w={{ base: '47.3%', md: '30.63%', lg: '24%' }} minH={{ lg: '20vh' }} flexDir={'column'} justify={'space-between'} align={'center'} borderRadius={'16px'} border={'1px solid gray'}>
            <Text textAlign={'center'} fontWeight={'700'}>
                {name}
            </Text>
            <Flex flexDir={'column'} align={'center'}>
                <Text>
                    R${price}
                </Text>
                <Text>
                    Estoque: {qnty_stock}
                </Text>
            </Flex>
        </Flex>
    )
}
