import Vue from 'vue'
import Home from '@/components/Home/Home'

describe('Home.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(Home)
    const vm = new Constructor().$mount()
    expect(vm.$el.querySelector('.sectionTitle').textContent).to.equal('Domain class')
  })
})
