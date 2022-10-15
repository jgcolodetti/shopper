import React, { useContext, useState } from 'react'
import Image from 'next/image';
import { Flex, Spacer, Text, Heading, Link, Button, IconButton } from '@chakra-ui/react'
import { ArrowForwardIcon, ArrowBackIcon } from '@chakra-ui/icons'
import { motion } from 'framer-motion'

export default function Header({ onHome, onOrder }) {
    return (
        <Flex justify={'center'} boxShadow={'md'} position={'sticky'} top={0} bg={'white'} zIndex={1}>
            <Flex p={{ base: '1rem', lg: '1.5rem' }} justify={'center'} align={'center'} flexGrow={'1'}>
                <Flex justify={'center'} w={{ base: '27vw', lg: '20vw' }}>
                    <Image src="/img/logo.svg" width={'200px'} height={'50px'} />
                </Flex>
                <Flex justify={'center'} w={{ base: '30vw', lg: '20vw' }}>
                    <Heading fontSize={{ base: '2xl', lg: '3xl' }}>
                        SHOPPER
                    </Heading>
                </Flex>
                <Flex justify={'center'} w={{ base: '33vw', lg: '20vw' }}>
                    {onHome ?
                        <Link href='/order' style={{ textDecoration: 'none' }}>
                            <Button bg={'#51B591'} color={'white'} size={{ base: 'xs', lg: 'md' }} rightIcon={<ArrowForwardIcon />} _hover={{ bg: '#1A7855' }} as={motion.button} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                Fazer Pedido
                            </Button>
                        </Link> :
                        <Flex></Flex>}
                    {onOrder ?
                        <Link href='/' style={{ textDecoration: 'none' }}>
                            <IconButton bg={'#51B591'} color={'white'} size={{ base: 'xs', lg: 'md' }} w={'100px'} icon={<ArrowBackIcon />} _hover={{ bg: '#1A7855' }} as={motion.button} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} />
                        </Link> :
                        <Flex></Flex>}
                </Flex>
            </Flex>
        </Flex>
    )
}
// #51B591