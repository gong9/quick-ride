export async function getInitialState(): Promise<{ name: string }> {
  return { name: 'gong-example-react-app' }
}

export const layout = () => {
  return {
    pure: true,
  }
}
