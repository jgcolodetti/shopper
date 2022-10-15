import React from 'react'
import { Flex, Spacer, Text, Heading, Link, Button } from '@chakra-ui/react'
import ProductCard from './ProductCard'

export default function Store({ products }) {
  return (
    <Flex justify={'center'} marginY={{ base: '10vh', md: '5vh', lg: '10vh' }}>
      <Flex flexWrap={'wrap'} maxW={{ base: '90%', lg: '60%' }} gap={{ base: '1rem', md: '2rem', lg: '14%' }} padding={{ base: '1rem', lg: '3rem' }} boxShadow={'xl'} flexGrow={'1'} borderRadius={'16px'} bg={'#51B591'} rowGap={{ base: '1rem', lg: '3rem' }}>
        {products.length > 0 && products.map((item) => {
          return <ProductCard
            product_id={item.product_id}
            name={item.name}
            price={item.price}
            qnty_stock={item.qnty_stock}
            key={item.product_id}
          />
        })}
      </Flex>
    </Flex>
  )
}
