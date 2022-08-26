export function NotionSetting(setting, bookListData, formData, GetMessage) {
  const loading = ref(false)

  const dbColumn = {
    BookTitle: 'title',
    SubTitle: 'rich_text',
    Author: 'rich_text',
    Publisher: 'rich_text',
    ISBN: 'rich_text',
    ReleaseDate: 'rich_text',
    Series: 'rich_text',
    SeriesNumber: 'rich_text',
    Rating: 'number',
    ReadPercent: 'number',
    LastRead: 'rich_text',
    FileSize: 'number',
    Source: 'rich_text',
  }

  async function getCover(title) {
    let noCover = 'https://via.placeholder.com/150x200?text=No%20Cover'
    let [errData, data] = await GetData(`https://www.googleapis.com/books/v1/volumes?q=${encodeURI(title)}`)
    if (errData) return noCover
    if (!data?.items) return noCover
    let filterData = data.items.filter(x => x.volumeInfo?.imageLinks?.thumbnail)
    return filterData?.[0].volumeInfo.imageLinks.thumbnail ?? noCover
  }

  async function update(token, database_id, title, bookList, highlight) {
    const getImages = await getCover(title)
    const [errData, data] = await PostData('v1/pages', {
      token: token,
      payload: {
        parent: {
          type: 'database_id',
          database_id: database_id,
        },
        cover: {
          type: 'external',
          external: {
            url: getImages,
          },
        },
        is_inline: true,
        properties: bookList,
        children: highlight.map(e => ({
          paragraph: {
            rich_text: [
              {
                text: {
                  content: e.join('\n'),
                },
              },
            ],
          },
        })),
      },
    })
    if (errData) return [errData]
    if (data.code) return [data.message]
    return [undefined, data]
  }

  async function create(token) {
    const [errData, data] = await PostData('v1/databases', {
      token: token,
      payload: {
        parent: {
          type: 'page_id',
          page_id: formData.page_id,
        },
        title: [
          {
            type: 'text',
            text: {
              content: 'Kobo Book List',
              link: null,
            },
          },
        ],
        properties: Object.entries(dbColumn).reduce((prev, [currKey, currValue]) => {
          prev[currKey] = { [currValue]: {} }
          return prev
        }, {}),
      },
    })
    if (errData) return [errData]
    if (data.code) return [data.message]
    if (!data.id) return ['No page ID!']
    return [undefined, data.id]
  }

  async function Submit() {
    loading.value = true
    let databaseID = formData.database_id
    if (formData.action === 'Create') {
      let [createErr, createData] = await create(formData.token)
      if (createErr) return GetMessage(createErr)
      databaseID = createData
    }
    let finalData = bookListData.content.filter(x => formData.allow.includes(x.ContentID))
    for (let index = 0; index < finalData.length; index++) {
      let columns = finalData[index]
      const [res] = setting.dbData.exec(HighLightSQL(columns.ContentID))
      let [createErr] = await update(
        formData.token,
        databaseID,
        columns.BookTitle,
        Object.entries(columns).reduce((prev, [currKey, currValue]) => {
          if (!dbColumn[currKey]) return prev
          let content =
            dbColumn[currKey] === 'number' ? (isNumber(toNumber(currValue)) ? toNumber(currValue) : 0) : [{ text: { content: currValue.toString() } }]
          prev[currKey] = { [dbColumn[currKey]]: content }
          return prev
        }, {}),
        res?.values ?? []
      )
      if (createErr) return GetMessage(createErr)
    }
    GetMessage('Success!', 'success')
  }

  return {
    loading,
    Submit,
  }
}
