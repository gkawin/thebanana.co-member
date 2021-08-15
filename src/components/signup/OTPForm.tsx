import { useWizardAction } from '@/pages/signup'
import { Button, Form, FormInput } from 'semantic-ui-react'

export const OTPForm = () => {
    const {} = useWizardAction()
    return (
        <Form>
            <FormInput type="text" label="หมายเลข OTP ที่ได้รับจาก SMS"></FormInput>
            <Button type="submit" primary fluid>
                ยืนยัน
            </Button>
        </Form>
    )
}
