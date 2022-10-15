import { Flex, Text } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import React from 'react'

export default function SearchItem({ name, onClick }) {
    return (
        <Flex _hover={{ cursor: 'pointer' }} as={motion.div} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onClick}>
            <Text fontWeight={'600'} fontSize={{base: '0.9rem', lg:'1rem'}}>
                {name}
            </Text>
        </Flex>
    )
}
