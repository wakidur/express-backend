db.articles.insert({ title: 'Article one',author: 'Brand Traversy',body: 'This is article one'},{title: 'Article one',author: 'Brand ',body:'This is article one'},{title: 'Article one',author: 'Brand Traversy Daa',body: 'This is article one'},{title: 'Article one',author:'Traversy',body: 'This is article one'});



db.articles.insert([{title: 'Article two',author: 'Brand ',body:'This is article one'},{title: 'Article three',author: 'Brand Traversy Daa',body: 'This is article one'},{title: 'Article four',author:'Traversy',body: 'This is article one'}],{ ordered: false })