import { Button, Input } from '@nextui-org/react'
import React from 'react'

const FooterNewsLetter = () => {
  return (
    <div className="flex flex-col space-y-3">
              <Input
                type="email"
                placeholder="Your email"
                className="border-dark-600 bg-dark-700 focus:border-gold-400 text-white"
              />
              <Button className="bg-gold-700 text-white hover:bg-gold-400 w-full">Subscribe</Button>
            </div>
  )
}

export default FooterNewsLetter
