import {
  useDisclosure, IconButton, Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text
} from '@chakra-ui/react'
import React from 'react'
import { ViewIcon } from "@chakra-ui/icons";
import { Image } from "@chakra-ui/image";
const Profile = ({ user, children }) => {
  // console.log(user)
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
      )}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="40px"
            fontFamily="Work Sans"
            ml="2rem"
          //   display='flex'
          //   justifyContent='center'
          >{user.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody display='flex' flexDirection="column" alignItems='center'>
            <Image
              borderRadius="full"
              boxSize="150px"
              src={user.image}
              alt={user.name}
              objectFit="cover"
              mb='50px'

            />
            <Text
              fontSize={{ bae: "28px", md: "30px" }}
              fontFamily="Work Sans"
            >
              Email: <span style={{ fontStyle: "bold", fontWeight: "900", }}>{user.email}</span>
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default Profile