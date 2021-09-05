import { useWizardAction } from '@/pages/signup'
import { Button, Form } from 'react-bootstrap'

export const MobilePhoneForm = () => {
    const { updateAction } = useWizardAction()
    return (
        <Form>
            <Form.Group>
                <Form.Label>เบอร์โทรศัพท์</Form.Label>
                <input type="text" pattern="d+" />
            </Form.Group>
            <Button type="submit" variant="primary" onClick={() => updateAction({ mobilePhone: 'test' })}>
                รอรับ SMS
            </Button>
        </Form>
    )
}
