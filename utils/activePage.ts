export const activePage = (pageName: string) => {
  const currentPageName = useRouter().currentRoute.value.name
  return currentPageName === pageName
}
