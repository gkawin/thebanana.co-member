import { useWizardAction } from '@/pages/signup'
import { Button, Form } from 'semantic-ui-react'

export const MobilePhoneForm = () => {
    const { updateAction } = useWizardAction()
    return (
        <Form>
            <Form.Field>
                <label>เบอร์โทรศัพท์</label>
                <input type="text" pattern="d+" />
            </Form.Field>
            <Button type="submit" primary fluid onClick={() => updateAction({ mobilePhone: 'test' })}>
                รอรับ SMS
            </Button>
        </Form>
    )
}
